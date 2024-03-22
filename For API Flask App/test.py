import requests

def test_api():
    url = 'http://127.0.0.1:5000/get_answer'
    data = {
        'pdf_file_path': 'sample.pdf',
        'question': 'How many planets are there in the solar system?'
    }
    response = requests.post(url, json=data)
    if response.status_code == 200:
        print("API works!")
        print("Response:", response.json())
    else:
        print("API request failed.")

if __name__ == "__main__":
    test_api()
