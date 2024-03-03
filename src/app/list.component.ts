import {Input, Component, EventEmitter, Output, OnInit} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { FormsModule } from '@angular/forms';


class Item{
    native: string;
    alien: string;
    constructor(native: string, alien: string) {

        this.native = native;
        this.alien = alien;
    }
}

@Component({
    selector: 'list-comp',
    standalone: true,
    imports: [ FormsModule ],
    templateUrl: `list.component.html`,
    styleUrl: 'list.component.css'
})
export class ListComponent implements OnInit{
    @Input() wordList: Item[] = []
    @Output() wordListChanged = new EventEmitter<Item[]>();
    showList: boolean = false;
    alienOrd: string = ""
    nativeOrd: string = ""
    addingMode: boolean = false
    CSV_FILE_URL: string = '/files/swedish.csv'

    constructor (private http: HttpClient) { }
    ngOnInit() {
        this.load()
    }

    toggleList() {
        this.showList = !this.showList
    }

    changed() {
        this.wordListChanged.emit(this.wordList)
    }

    newItem() {
        this.addingMode = true
    }

    saveItem() {
        this.addingMode = false
        this.wordList.push({alien: this.alienOrd, native: this.nativeOrd})
        this.alienOrd = this.nativeOrd = ""
        this.changed()
    }

    deleteItem(alien:string) {
        this.wordList = this.wordList.filter((item: Item) => item.alien !== alien)
        this.changed()
    }

    store() {
        localStorage.setItem('wordList', JSON.stringify(this.wordList))
    }

    load() {
        let list = JSON.parse(localStorage.getItem('wordList'))
        if (list) {
            this.wordList = list
            this.changed()
        } else {
            console.log('Local storage is empty')
        }
    }

    getFromServer() {
        this.http.get(this.CSV_FILE_URL, {responseType: 'text'}).subscribe(data => {
                this.decodeData(data)
                this.changed()
            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log('An error occurred:', err.error.message);
                } else {
                    console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
                }
            }
        );
    }

    decodeData(data: string) {
        let lines: string[] = data.split( '\r\n')
        let parts: string[]
        let exist
        lines.forEach(line => {
            parts = line.split(';')
            if (parts.length == 2 && parts[0].length && parts[1].length) {
                exist = this.wordList.filter((item: Item) => item.alien === parts[0])
                if (!exist.length) {
                    this.wordList.push({alien: parts[0], native: parts[1]})
                }
            }
        });

        this.wordList.sort(function (a: Item,b: Item) {
            let keyA = a.alien,
                keyB = b.alien;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        })
    }
}

export {Item}