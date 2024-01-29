import "../index.css";
import {useEffect, useState} from 'react';
// import useSpeechRecognition from "./speech";

const SearchBar = () => {
    // const {
    //   text,
    //   isListening,
    //   startListening,
    //   stopListening,
    //   resetText,
    //   hasRecognitionSupport,
    //   } = useSpeechRecognition();

    const [data, setData] = useState([]);
    const [keywords, setKeywords] = useState("");

    const handleRandomQuery = () => {
        window.location.href = process.env.REACT_APP_API_URL + "wiki/Special:Random";
    }

    const handleSearchQuery = async (event, direction) => { 
        try {
            event.preventDefault();
            const kw = keywords
            

            // Make an HTTPS request using fetch
            const response = await fetch(process.env.REACT_APP_HOST_API + "query", 
                {method: 'POST', // or 'PUT', 'DELETE', etc., depending on your API
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    keywords: kw
                })}
            );
            
            // Check if the request was successful (status code 200-299)
            if (response.ok) {
                // Parse the response data (assuming it's JSON in this example)
                const result = await response.json();

                // Extract all objects from the 'pages' property of the response
                setData(result.pages.slice(0, 50))

            } else {
            // Handle error if the request was not successful
                console.error('Error fetching data:', response.statusText);
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error fetching data:', error.message);
        }
    }
    // useEffect(() => {
    //     setKeywords(text)
    // }, [text]);
    
    return (
<>
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="mb-4 text-white">
      <button type="button" onClick={handleRandomQuery}>
        Click here for a random article
      </button>
    </div>
    <div className="relative z-10 mb-2"> 
        <button
            type="button"
            className="absolute top-1/3 right-2 transform -translate-y-1/2 pr-2 mt-0.5"
            onClick={(e) => setKeywords("")}
        >
            <img src='./close-button-png-23.png' className="w-4" alt="Close" />
        </button>
        <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="mb-4 text-white px-10 py-1 rounded-full border-4 border-input focus:outline-none focus:border-primary-main bg-main"
        />
        {/* <button
            className="absolute left-0 top-0 m-2 p-2 mt-0.5 rounded-md"
            style={{ paddingBottom: '4px' }}
            onClick={startListening}
            >
            <img
                src="/mic.png"
                alt="Image"
                className="w-6 h-6"
            />
        </button> */}
    </div>
    <div className="mb-4 text-white">
      <button type="button" onClick={(e) => handleSearchQuery(e, "")}>
        Click icon to search
      </button>
    </div>
    <div className="overflow-y-auto max-w-screen-lg">
      {data && (
        <div>
          {data.map((obj, index) => (
            <div
              key={index}
              className="card bg-white overflow-hidden mb-4"
            >
              <h3 className="font-bold text-black">{obj.title}</h3>
              <p className="text-black">{obj.extract}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</>
    );
}

export default SearchBar;