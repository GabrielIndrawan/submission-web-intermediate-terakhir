import { openDB } from "idb";

export class IndexedDB{

    #database = null;
    #name = null

    constructor(name){
        this.#name = name;
        this.initDatabase(name);
    }

    initDatabase(name){
        this.#database = openDB("my-database",1,{
            upgrade(database){
                database.createObjectStore(name,{keyPath: 'id'});
            }
        });
    }

    async getAllData(){
        try{
            return (await this.#database).getAll(this.#name)
        }catch(error){
            console.log("Error get all data: ", error);
            return false;
        }
    }

    async inputData(data){
        try{
            await (await this.#database).add(this.#name, data);
            return true;
        }catch(error){
            return false;
        }
    }

    async deleteData(data){
        try{
            (await this.#database).delete(this.#name, data.id);
            return true;
        }catch(error){
            console.log("Error delete data: ", error);
            return false;
        }
    }
}