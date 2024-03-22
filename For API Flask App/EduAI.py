from flask import Flask, request, jsonify
from transformers import BertForQuestionAnswering, BertTokenizer
import torch
import PyPDF2

app = Flask(__name__)

def extract_text_from_pdf(pdf_file):
    with open(pdf_file, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text

def answer_question_about_pdf(question, pdf_file_path):
    pdf_text = extract_text_from_pdf(pdf_file_path)
    tokenizer = BertTokenizer.from_pretrained('bert-large-uncased-whole-word-masking-finetuned-squad')
    model = BertForQuestionAnswering.from_pretrained('bert-large-uncased-whole-word-masking-finetuned-squad')
    
    inputs = tokenizer(question, pdf_text, add_special_tokens=True, return_tensors='pt')
    outputs = model(**inputs)
    
    start_logits = outputs.start_logits
    end_logits = outputs.end_logits

    answer_start = torch.argmax(start_logits)
    answer_end = torch.argmax(end_logits) + 1

    answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(inputs['input_ids'][0][answer_start:answer_end]))
    return answer

@app.route('/get_answer', methods=['POST'])
def get_answer():
    data = request.get_json()
    pdf_file_path = data['pdf_file_path']
    question = data['question']
    answer = answer_question_about_pdf(question, pdf_file_path)
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True)
