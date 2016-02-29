import {Component} from '../ngDecorators';
import template from './home.html!text';

@Component({
    selector: 'home',
    template: template })
class Home {
    constructor() {
        this.message = 'This is my homepage';
    }
}

export default Home;