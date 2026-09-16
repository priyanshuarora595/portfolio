# Market Trend Analysis — Nifty 100 Stock Price Prediction

## Problem
This project predicts the next-day closing price for stocks in India's Nifty 100 index by combining time-series price/technical data with fundamental and macroeconomic context, rather than relying on price history alone. It was built as the final submission for my Major in AI coursework at IIT Ropar, aimed at demonstrating an applied deep-learning approach to financial time-series forecasting, packaged with an interactive demo so predictions could be explored per-stock rather than only inspected in a notebook.

## My Role
Solo project, built end-to-end by me as coursework: the data pipeline, feature engineering, model architecture and training, and the Streamlit demo app.

## Architecture
**Data pipeline:** daily OHLCV history (up to 20 years) is downloaded via `yfinance` for 43 Nifty 100 constituent stocks and cached to CSV, with subsequent runs fetching only the date range missing since the last cached row instead of re-downloading full history. Each stock is additionally enriched with: the Nifty 50 index and India VIX as macro indicators, quarterly EPS pulled from Yahoo Finance fundamentals, and a sector index (Nifty IT / Nifty Bank / Nifty Energy, mapped per stock, Nifty 50 as the default) — all merged into one per-stock feature table by date.

**Feature engineering** (`stock_utils.add_features`) computes technical indicators from raw OHLCV: daily returns, 7- and 21-day moving averages, 21-day Bollinger Bands, a 20-day EMA, 5-day momentum, 14-day RSI, MACD(12,26) with a 9-day signal line, and 14-day ATR — then forward/back-fills the lower-frequency fundamental and macro series to align them to daily granularity.

**Model:** a hybrid two-branch neural network in Keras/TensorFlow (`build_hybrid_model`). A sequential branch takes a 30-day lookback window over 17 time-series features (OHLCV plus the technical indicators above) through two stacked LSTM layers (128 then 64 units, with dropout after each). A static branch takes point-in-time fundamentals/macro context (EPS, Nifty level, VIX, sector index) through two Dense layers. The two branches are concatenated and passed through a final Dense layer to output a single next-day closing-price prediction. Training uses Huber loss, the Adam optimizer, early stopping and `ReduceLROnPlateau` on an 80/20 chronological train/test split.

**Serving:** a Streamlit app (`app.py`) loads the trained model once per session, lets the user pick any of the 43 trained tickers, re-fetches the latest ~200 days of price data plus current fundamentals/macro values at request time, rebuilds the same feature set used in training, and displays the last known close against the predicted next close alongside a historical price chart.

A couple of deliberate engineering choices: device selection auto-detects GPU/CPU/TPU depending on environment (Colab vs. local macOS/Windows/Linux) so the same code trains/predicts correctly across environments, and all fetched market/fundamental/sector data is disk-cached (CSV/JSON) to avoid redundant API calls on repeated runs.

## Tech Stack
- Python, Jupyter Notebook
- TensorFlow / Keras (hybrid LSTM + Dense model)
- scikit-learn (MinMax scaling, RMSE/MAE/R² evaluation)
- pandas, NumPy (feature engineering)
- yfinance (OHLCV price data, fundamentals, macro indicators)
- Streamlit (interactive prediction app)
- Matplotlib (charting)

## Impact / Results
This is an academic project (final submission, AI major, IIT Ropar), not a deployed trading system. On the held-out 20% test split (chronological, MinMax-scaled target), the trained hybrid model achieved RMSE 0.0319, MAE 0.0117, and R² 0.9761 for next-day closing-price prediction, evaluated across the 43 trained Nifty 100 stocks using up to 20 years of daily history per stock. It has not been backtested against a trading strategy or validated on live/unseen market regimes.

## Links
- GitHub repo: https://github.com/priyanshuarora595/Market-Trend-Analysis
