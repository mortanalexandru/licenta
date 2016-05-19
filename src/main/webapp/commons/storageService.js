import {Service} from "/ngDecorators"
import {window} from "/commons/externalServices"
//import localStorageServiceProvider from "LocalStorageModule"


@Service({serviceName: 'storageService'})
class StorageService {

    save(key, value){
        window().sessionStorage[key] = value;
    }

    get(key){
        return window().sessionStorage[key];
    }


    remove(key){
        return window().sessionStorage.removeItem(key);
    }




}
export default StorageService.instance;