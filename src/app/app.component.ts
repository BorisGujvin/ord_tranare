import { Component } from "@angular/core";
import { FormsModule }   from "@angular/forms";
import { HttpClient, HttpErrorResponse} from "@angular/common/http";


class Item{
    native: string;
    alien: string;

    constructor(native: string, alien: string) {

        this.native = native;
        this.alien = alien;
    }
}

@Component({
    selector: "app-root",
    standalone: true,
    imports: [FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    native: string = "";
    alien: string = "";
    answer: string = "";
    correctAnswer: string = "";
    status: string = "";
    showList: boolean = true;
    correctAnswers: number = 0;
    incorrectAnswers: number = 0;
    wordList: Item[]

    constructor (http: HttpClient) {
        http.get('/files/swedish.csv', {responseType: 'text'}).subscribe(data => {
                this.decodeData(data)
            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log('An error occurred:', err.error.message);
                } else {
                    console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
                }
            }
        );
        this.wordList = []
    }
    decodeData(data: string) {
        let lines: string[] = data.split( '\r\n')
        let parts: string[]
        lines.forEach(line => {
            parts = line.split(';')
            if (parts.length == 2)
                this.wordList.push({alien:parts[0], native:parts[1]})
        });
        this.wordList.sort(function (a: Item,b: Item) {
            let keyA = a.alien,
                keyB = b.alien;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        })
    }
    randomNative () {
        let i: Item = this.randomWord()
        this.native = i.native
        this.alien = ''
        this.correctAnswer = i.alien
        // this.correctAnswers = this.incorrectAnswers = 0;
    }

    randomAlien() {
        let i: Item = this.randomWord()
        this.alien = i.alien
        this.native = ''
        this.correctAnswer = i.native
        // this.correctAnswers = this.incorrectAnswers = 0;

    }

    randomWord() {
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
        }, 2000)
    }

    toggleList() {
        this.showList = !this.showList
    }

}
