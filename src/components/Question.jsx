import {decode} from 'html-entities';
export default function Question(props){
    /**
     * Renders the answers for the quiz.
     */
    function renderAnswers(){
        let answerElements = []
        for(let i = 0; i < props.incorrect_answers.length; i++){
            answerElements.push(<li key={i} className='list-item'>{decode(props.incorrect_answers[i])}</li>)
        }
        return answerElements
    }
    return(
        <section className="question">
            <p>{decode(props.question)}</p>
            <ul className="answers" onClick={props.handleSelect}>
                {renderAnswers()}
            </ul>
        </section>
    )
}