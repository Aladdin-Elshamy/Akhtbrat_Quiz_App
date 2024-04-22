import React, { useState } from "react"
import Question from "./components/Question"
import Select from 'react-select';
import {decode} from 'html-entities';
const options = [
  { value: 5, label: 'Five' },
  { value: 8, label: 'Eight' },
  { value: 10, label: 'Ten' },
];
function App() {
  const [questions, setQuestion] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('')
  const [sumbit,setSumbit] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [selectedOption, setSelectedOption] = useState(5);
  /**
  *A function that handles change events.
  */
  function handleChange(e) {
    setSelectedOption(e.value)
  }
  /**
   * Shuffles the elements of the given array.
   */
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  /**
   * An asynchronous function that handles the click event. It sets loading state to true,
   * submit state to false, and correct state to 0. Then it makes a GET request to 
   * 'https://opentdb.com/api.php?amount=number' and sets the question state with the result.
   * If the request fails, it sets the error state with the error message. Finally, it sets
   * the loading state to false.
   */
  const handleClick = async () => {
    setIsLoading(true)
    setSumbit(false)
    setCorrect(0)

    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=${selectedOption}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();
      result.results.forEach(question => {
        question.incorrect_answers.push(question.correct_answer)
        question.incorrect_answers = shuffleArray(question.incorrect_answers)
      })
      setQuestion(result);
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  /** 
   *  Function to handle the selection of a child element
  */
  function handleSelect(e){
    e.currentTarget.childNodes.forEach(el => {
      el!==e.target && el.classList.remove('selected')
    })
    if(e.target.classList.contains('list-item')){
      e.target.classList.toggle('selected')
    }

  }
  
/*
  * Handle the form submission and get the score based on the user's selections.
*/
  function handleSubmit(){
    setSumbit(true)
    
    const choices = document.querySelectorAll('.answers')
    choices.forEach((an, index) => {
      an.childNodes.forEach(el => {
        const correctAnswer = decode(questions.results[index].correct_answer)

        if(!el.classList.contains("selected") && el.textContent == correctAnswer){
          el.classList.add("correct")
          
        }
        else if(el.classList.contains("selected") && el.textContent == correctAnswer){
          el.classList.add("correct")
          el.classList.remove("selected")
          setCorrect(prev => prev + 1)
        }
        else if(el.classList.contains("selected") && el.textContent !== correctAnswer){
          el.classList.add("incorrect")
          el.classList.remove("selected")
          el.classList.add("disabled")
        }
        else{
          el.classList.add("disabled")
        }
      })
    })
  }
  /**
 * Renders the intro message based on the state of error, loading, and questions.
 */
  function renderIntroMessage(){
    if(err){
      return (<div className="error">
      <h2>{err}</h2>
      </div>
      )
    }
    if(isLoading){
      return (<div className="loading">
      <h2>Loading ...</h2>
      </div>)
    }
    if(questions.results?.length > 0){
      return (<div className="question-container">
          {questions.results.map(question => <Question key={question.question} {...question}
          handleSelect={handleSelect}/>)}
          {sumbit ? <div className="result">
            <p>You Scored {correct}/{questions.results.length} correct answers</p>
            <button className="btn" onClick={handleClick}>Play again</button>
          </div> :
          <button className="btn" onClick={handleSubmit}>Check Answers</button>
          }
      </div>
      )
    }
    return false;
  }
  return (
    <main>
      <img src="./images/blob5.png" alt="" className="first-image" />
      <div className="container">
       {
          renderIntroMessage() ||
          <div className="start-page">

            <h1>Akhtbart</h1>
            <p>Test your knowledge with this quiz</p>
            <Select
              className="select"
              defaultValue={selectedOption}
              onChange={handleChange}
              options={options}
              placeholder="Number of questions default(5)"
              aria-label="Select number of questions"
            />
            <button className="btn" onClick={handleClick}>Start quiz</button>
          </div>
        }
      </div>
      <img src="./images/blob6.png" alt="" className="last-image" />
    </main>
  )
}

export default App
