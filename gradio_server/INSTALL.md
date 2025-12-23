# Installing Gradio Dependencies

## Quick Install

### Windows
```bash
cd backend/gradio_server
pip install -r requirements.txt
```

Or use the batch file:
```bash
cd backend/gradio_server
install.bat
```

### Mac/Linux
```bash
cd backend/gradio_server
pip install -r requirements.txt
```

Or use the shell script:
```bash
cd backend/gradio_server
chmod +x install.sh
./install.sh
```

### Using npm script (from backend root)
```bash
cd backend
npm run gradio:install
```

## Requirements

- Python 3.8 or higher
- pip (Python package manager)

## Verify Installation

After installation, verify it works:
```bash
cd backend/gradio_server
python -c "import gradio; print('Gradio installed successfully!')"
```

## Troubleshooting

### "pip is not recognized"
- Make sure Python is installed
- Add Python to your PATH
- Or use `python -m pip` instead of `pip`

### "Permission denied"
- On Mac/Linux, try: `pip install --user -r requirements.txt`
- Or use: `sudo pip install -r requirements.txt`

### "ModuleNotFoundError: No module named 'gradio'"
- Make sure you're using the correct Python version
- Try: `python3 -m pip install -r requirements.txt`
- Verify: `python --version` (should be 3.8+)

## After Installation

Once installed, Gradio will start automatically when you run:
```bash
npm start
```

No need to run Gradio separately!

