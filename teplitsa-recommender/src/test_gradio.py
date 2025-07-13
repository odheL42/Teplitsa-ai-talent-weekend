import time

import gradio as gr


def response(message, history):
    line = """AI Talent Hub — крупнейшая магистратура и комьюнити по искусственному интеллекту в России. Совместно с ведущими компаниями, мы помогаем студентам развивать навыки в области ИИ, LLM, безопасности и внедрения AI-решений в бизнес."""
    _line = ""

    for token in line.split(" "):
        time.sleep(0.1)
        _line += token + " "
        yield _line


gr.ChatInterface(fn=response, type="messages").launch()
