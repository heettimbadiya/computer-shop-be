@echo off
REM Install Gradio dependencies for Windows
echo 📦 Installing Gradio dependencies...
pip install -r requirements.txt
if %errorlevel% equ 0 (
    echo ✅ Gradio dependencies installed!
    echo 💡 You can now start the backend and Gradio will start automatically.
) else (
    echo ❌ Installation failed. Make sure Python and pip are installed.
    echo 💡 Install Python from https://www.python.org/
)
pause

