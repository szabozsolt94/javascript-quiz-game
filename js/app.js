/*global questions*/
const $startBtn = document.querySelector('.start-btn')
const $skipBtn = document.querySelector('.skip-btn')
const $quizHeader = document.querySelector('.quiz-header')
const $quizBody = document.querySelector('.quiz-body')
const $optionContainer = document.querySelector('.option-container')
const $resultContainer = document.querySelector('.result-container')
const $titleContainer = document.querySelector('.title-container')
const $totalPrize = document.querySelector('.total-prize')
const $currentPrize = document.querySelector('.current-prize')

function removeDuplicates(originalArray) {
    originalArray.sort(function (a, b) {
        if (a.question < b.question) {
            return -1
        }
        if (a.question > b.question) {
            return 1
        }
        return 0
    })
    for (let i = 0; i < originalArray.length - 1; i++) {
        let current = originalArray[i].question
        let next = originalArray[i + 1].question
        if (current === next) {
            let positionOfDuplicate = originalArray.indexOf(originalArray[i])
            originalArray.splice(positionOfDuplicate, 1)
        }
    }
    return originalArray
}
const questionsWithNoDuplicates = removeDuplicates(questions)

let gameState
function initGameState(originalQuestions) {
    return {
        totalPrize: 0,
        prizeOnCurrentRound: 100,
        maxPrize: 1000000,
        questionsInCurrentRound: [...originalQuestions]
    }
}

function getRandomIndexOf(originalArray) {
    return Math.floor(Math.random() * originalArray.length)
}

function showHiddenElements() {
    $quizHeader.classList.remove('starter-state')
    $skipBtn.classList.remove('default-hidden')
    $quizBody.classList.remove('default-hidden')
    $resultContainer.classList.remove('default-hidden')
}

function clearElementsFromPreviousGame(...parentElements) {
    for (let element of parentElements) {
        element.querySelectorAll('*').forEach(childElement => childElement.remove())
    }
}

function startQuiz() {
    clearElementsFromPreviousGame($titleContainer, $optionContainer)
    showHiddenElements()

    const indexOfQuestion = getRandomIndexOf(gameState.questionsInCurrentRound)
    const currentQuestion = gameState.questionsInCurrentRound[indexOfQuestion]
    gameState.questionsInCurrentRound.splice(indexOfQuestion, 1)

    $totalPrize.innerHTML = `Total prize: ${gameState.totalPrize}`
    $currentPrize.innerHTML = `Prize on current round: ${gameState.prizeOnCurrentRound}`

    const $questionTitle = document.createElement('h1')
    $questionTitle.classList.add('question-title')
    $questionTitle.innerHTML = currentQuestion.question
    $titleContainer.appendChild($questionTitle)

    for (let i = 0; i < currentQuestion.content.length; i++) {
        const optionContent = currentQuestion.content[i]
        const optionField = document.createElement('button')
        optionField.classList.add('btn', 'option-btn')
        optionField.innerHTML = optionContent
        $optionContainer.appendChild(optionField)
    }

    const $optionFields = document.querySelectorAll('.option-btn')
    for (let j = 0; j < $optionFields.length; j++) {
        const $optionField = $optionFields[j]
        $optionField.addEventListener('click', function checkAnswer() {
            const indexOfChosen = j
            const indexOfCorrect = currentQuestion.correct
            if (indexOfChosen === indexOfCorrect) {
                gameState.totalPrize += gameState.prizeOnCurrentRound
                gameState.prizeOnCurrentRound *= 2
                if (gameState.totalPrize >= gameState.maxPrize) {
                    clearElementsFromPreviousGame($optionContainer)
                    $questionTitle.innerHTML = `Congratulations! You won ${gameState.maxPrize}.`
                    $resultContainer.classList.add('default-hidden')
                    $skipBtn.disabled = true
                } else {
                    startQuiz()
                }
            } else {
                clearElementsFromPreviousGame($optionContainer)
                $questionTitle.innerHTML = `Game over. Your prize is: ${gameState.totalPrize}`
                $resultContainer.classList.add('default-hidden')
                $skipBtn.disabled = true
            }
        })
    }
}

function skipQuestion() {
    $skipBtn.disabled = true
    startQuiz()
}

function quizSetup() {
    gameState = initGameState(questionsWithNoDuplicates)
    $skipBtn.disabled = false
    startQuiz()
}

$skipBtn.onclick = skipQuestion
$startBtn.onclick = quizSetup