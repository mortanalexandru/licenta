import {Service} from "/ngDecorators"
import {window} from "/commons/externalServices"
//import localStorageServiceProvider from "LocalStorageModule"


@Service({serviceName: 'storageService'})
class StorageService {

    //constructor() {
    //    debugger;
    //
    //}

    save(key, value){
        window().sessionStorage[key] = value;
    }

    get(key){
        return window().sessionStorage[key];
    }



}
export default StorageService.instance;