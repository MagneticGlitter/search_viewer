from flask import Flask, jsonify, request, render_template
from dotenv import load_dotenv
import os
from flask_cors import CORS

from bs4 import BeautifulSoup
import requests

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})
load_dotenv()


@app.route('/query', methods=['POST'])
def query():
    try:
        data = request.get_json()
        keywords = data['keywords']
        url = f"w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch={keywords}"

        print(keywords)
        # base_url = os.getenv('API_URL')
        response = requests.get(os.getenv("API_URL") + url)
        response.raise_for_status() 
        res_json = response.json()
        lst = []
        for each in res_json["query"]["pages"]:
            lst.append(res_json["query"]["pages"][each])
        return {"pages": lst}
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/random')
def random():
    try:
        response = requests.get(os.getenv("API_URL")+"wiki/Special:Random")
        response.raise_for_status() 

        data = response.text
        title = get_title(data)
        summary = get_summary(data)
        url = "https://en.wikipedia.org/wiki/" + title.replace(" ", "_")
        return {
            "title": title,
            "summary": summary,
            "url": url
        }
    
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500
    
def get_title(data:str) -> str:
    # Parse the HTML string
    soup = BeautifulSoup(data, 'html.parser')

    # Get the element with id="firstheading"
    first_heading = soup.find("title")
    return first_heading.get_text(strip=True).replace(" - Wikipedia","")

def get_summary(data:str) -> str:
    # Parse the HTML string
    soup = BeautifulSoup(data, 'html.parser')

    mw_content_text_div = soup.find(id='mw-content-text')
    # Check if the div exists
    if mw_content_text_div:
        # Find all p tags under the div
        p_tags = mw_content_text_div.find_all('p')

        # Iterate over the p tags
        for p_tag in p_tags:
            # Check if the p tag has more than 10 characters of text
            if len(p_tag.get_text()) > 10:
                # Get the text under the first p tag
                all_text_under_first_p = p_tag.get_text().replace('\n', '')
                return all_text_under_first_p[:200] + " ... "
        else:
            print("No p tag with more than 10 characters found under id='mw-content-text'")
    else:
        print("Element with id='mw-content-text' not found")
    return ""
    


if __name__ == '__main__':
    app.run(debug=True)
