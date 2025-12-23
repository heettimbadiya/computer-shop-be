"""
Gradio Server for PC Builder - Mobile Optimized
Experimental implementation for phone usage
Part of the Backend repository
"""
import gradio as gr
import json
import requests
import os
from typing import Optional

# Configuration - Uses same port as backend or separate port
BACKEND_PORT = int(os.getenv('PORT', 5000))
GRADIO_PORT = int(os.getenv('GRADIO_PORT', 7860))

# Determine backend URL - use Render URL if available, otherwise localhost
RENDER_URL = os.getenv('RENDER_EXTERNAL_URL') or os.getenv('RENDER_URL')
if RENDER_URL:
    # Remove trailing slash if present
    RENDER_URL = RENDER_URL.rstrip('/')
    BACKEND_API_URL = f"{RENDER_URL}/api"
else:
    BACKEND_API_URL = f"http://localhost:{BACKEND_PORT}/api"

GRADIO_SHARE = os.getenv('GRADIO_SHARE', 'False').lower() == 'true'

def get_parts(category: Optional[str] = None):
    """Fetch parts from the backend API"""
    try:
        url = f"{BACKEND_API_URL}/parts"
        params = {"category": category} if category else {}
        response = requests.get(url, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data.get("data", [])
        return []
    except Exception as e:
        print(f"Error fetching parts: {e}")
        return []

def format_part_info(parts):
    """Format parts information for display"""
    if not parts:
        return "No parts found."
    
    result = []
    for part in parts[:10]:  # Limit to 10 for mobile display
        info = f"**{part.get('name', 'Unknown')}**\n"
        info += f"Category: {part.get('category', 'N/A')}\n"
        info += f"Price: ${part.get('price', 0):,.2f}\n"
        info += f"Stock: {part.get('stock', 0)} units\n"
        if part.get('description'):
            info += f"Description: {part.get('description', '')[:100]}...\n"
        info += "\n---\n"
        result.append(info)
    
    return "\n".join(result)

def search_parts(query: str, category: str):
    """Search and filter parts"""
    if not query and not category:
        return "Please enter a search query or select a category."
    
    parts = get_parts(category if category != "All" else None)
    
    if query:
        query_lower = query.lower()
        parts = [
            p for p in parts 
            if query_lower in p.get('name', '').lower() 
            or query_lower in p.get('description', '').lower()
        ]
    
    return format_part_info(parts)

def calculate_total(selected_parts: str):
    """Calculate total price from selected parts"""
    if not selected_parts:
        return "Please select parts first."
    
    try:
        # Parse selected parts (comma-separated part names)
        part_names = [name.strip() for name in selected_parts.split(',')]
        all_parts = get_parts()
        
        total = 0
        found_parts = []
        
        for part in all_parts:
            if part.get('name') in part_names:
                price = part.get('price', 0)
                total += price
                found_parts.append(f"{part.get('name')}: ${price:,.2f}")
        
        if not found_parts:
            return "No matching parts found. Please check the part names."
        
        result = "**Selected Parts:**\n\n"
        result += "\n".join(found_parts)
        result += f"\n\n**Total Price: ${total:,.2f}**"
        return result
    except Exception as e:
        return f"Error calculating total: {str(e)}"

# Mobile-optimized Gradio interface
with gr.Blocks(
    title="PC Builder - Mobile",
    theme=gr.themes.Soft(primary_hue="purple"),
    css="""
    .gradio-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 100% !important;
    }
    .mobile-optimized {
        max-width: 100%;
        padding: 10px;
    }
    @media (max-width: 768px) {
        .gradio-container {
            padding: 5px !important;
        }
        .gradio-container .main {
            max-width: 100% !important;
        }
        input, select, textarea, button {
            font-size: 16px !important; /* Prevents zoom on iOS */
        }
    }
    """
) as demo:
    gr.Markdown(
        """
        # 🖥️ PC Builder - Mobile Interface
        **Experimental Mobile Version**
        
        Search and browse computer components optimized for mobile devices.
        """,
        elem_classes=["mobile-optimized"]
    )
    
    with gr.Row():
        with gr.Column(scale=2):
            search_query = gr.Textbox(
                label="🔍 Search Parts",
                placeholder="Enter part name or description...",
                elem_classes=["mobile-optimized"]
            )
        with gr.Column(scale=1):
            category_filter = gr.Dropdown(
                choices=["All", "CPU", "GPU", "RAM", "Storage", "Motherboard", "Power Supply", "Cabinet"],
                value="All",
                label="📦 Category",
                elem_classes=["mobile-optimized"]
            )
    
    search_btn = gr.Button("Search", variant="primary", size="lg")
    
    with gr.Row():
        results = gr.Markdown(
            label="📋 Results",
            elem_classes=["mobile-optimized"]
        )
    
    gr.Markdown("---")
    
    with gr.Row():
        with gr.Column():
            gr.Markdown("### 💰 Price Calculator")
            selected_parts_input = gr.Textbox(
                label="Selected Parts (comma-separated)",
                placeholder="e.g., AMD Ryzen 9 5900X, NVIDIA GeForce RTX 4080",
                elem_classes=["mobile-optimized"]
            )
            calculate_btn = gr.Button("Calculate Total", variant="primary")
            total_output = gr.Markdown(label="Total")
    
    # Event handlers
    search_btn.click(
        fn=search_parts,
        inputs=[search_query, category_filter],
        outputs=results
    )
    
    search_query.submit(
        fn=search_parts,
        inputs=[search_query, category_filter],
        outputs=results
    )
    
    category_filter.change(
        fn=search_parts,
        inputs=[search_query, category_filter],
        outputs=results
    )
    
    calculate_btn.click(
        fn=calculate_total,
        inputs=selected_parts_input,
        outputs=total_output
    )
    
    # Load initial data
    demo.load(
        fn=lambda: search_parts("", "All"),
        outputs=results
    )

if __name__ == "__main__":
    print(f"🚀 Starting Gradio server on port {GRADIO_PORT}")
    print(f"📱 Mobile-optimized interface")
    
    # Determine the access URL
    if RENDER_URL:
        base_url = RENDER_URL.replace('/api', '').rstrip('/')
        print(f"🔗 Access at: {base_url}:{GRADIO_PORT}")
    else:
        print(f"🔗 Access at: http://localhost:{GRADIO_PORT}")
    
    print(f"🔌 Backend API: {BACKEND_API_URL}")
    print(f"⚠️  Note: This is an experimental implementation")
    print(f"📦 Part of Backend repository")
    
    try:
        demo.launch(
            server_name="0.0.0.0",
            server_port=GRADIO_PORT,
            share=GRADIO_SHARE,
            show_error=True,
            favicon_path=None,
            inbrowser=False  # Don't open browser automatically
        )
    except Exception as e:
        print(f"❌ Error starting Gradio: {e}")
        print(f"💡 Make sure port {GRADIO_PORT} is available")
        raise

