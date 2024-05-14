
//what for:  clear success and fail lanes, and more specific error shout-outs! 
class Result {
    constructor(success, data, error) {
       this.success = success;
       this.data = data;
       this.error = error;
    }
 
    static Success(data) {
       return new Result(true, data, null);
    }
 
    static Fail(error) {
       return new Result(false, null, error);
    }
 }

 module.exports = Result;