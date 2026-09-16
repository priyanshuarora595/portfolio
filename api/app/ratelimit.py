import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request

from app.config import RATE_LIMIT_PER_HOUR

_WINDOW_SECONDS = 3600
_requests: dict[str, deque] = defaultdict(deque)


def enforce_rate_limit(request: Request) -> None:
    """In-memory sliding-window limiter, per process.

    Good enough for a single free-tier instance with low traffic; resets on
    restart/redeploy, and won't be consistent across multiple instances if
    the service is ever scaled horizontally.
    """
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    bucket = _requests[client_ip]

    while bucket and now - bucket[0] > _WINDOW_SECONDS:
        bucket.popleft()

    if len(bucket) >= RATE_LIMIT_PER_HOUR:
        raise HTTPException(
            status_code=429,
            detail="You've hit the chat limit for now — please try again later.",
        )

    bucket.append(now)
