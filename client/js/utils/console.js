export class Console{
    log(data){
        if(process.env.DEBUG_ENABLED) console.log(data); //eslint-disable-line
    }
    error(data){
        if(process.env.DEBUG_ENABLED) console.error(data); //eslint-disable-line
    }
    warn(data){
        if(process.env.DEBUG_ENABLED) console.warn(data); //eslint-disable-line
    }
}