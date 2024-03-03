import { Component } from "@angular/core";
import { FormsModule }   from "@angular/forms";
import { ListComponent, Item } from "./list.component";


@Component({
    selector: "app-root",
    standalone: true,
    imports: [FormsModule, ListComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    native: string = "";
    alien: string = "";
    answer: string = "";
    correctAnswer: string = "";
    status: string = "";
    correctAnswers: number = 0;
    incorrectAnswers: number = 0;
    wordList: Item[] = []
    help: boolean = false

    wordListChanged(newList) {
        this.wordList = newList
    }

    randomNative () {
        let i: Item = this.randomWord()
        this.native = i.native
        this.alien = ''
        this.correctAnswer = i.alien
    }

    randomAlien() {
        let i: Item = this.randomWord()
        this.alien = i.alien
        this.native = ''
        this.correctAnswer = i.native
    }

    randomWord() {
        this.help = false
        let n: number =  Math.floor(Math.random() * this.wordList.length)
        return this.wordList[n]

    }

    answerGiven() {
        if (!this.answer.length)
            return
        if (this.correctAnswer.startsWith(this.answer)) {
            this.status = 'correct'
            this.correctAnswers += 1;
        } else {
            this.status = 'incorrect'
            this.incorrectAnswers += 1;
        }
        const timerId = setTimeout(() => {
            this.status = "";
            this.answer = "";
            if (this.native) {
                this.randomNative()
            } else {
                this.randomAlien()
            }
        }, this.status === 'correct' ? 1000 : 5000)
    }
}
