class Session {
    constructor(row) {
        if (row) {
            this.version = row.version;
            switch(this.version) {
                default:
                    console.warn("Version was not specified for reading from session row. Defaulting to 1.0.0")
                case "1.0.0":
                    this.id = row.id;
                    this.createdDatetime = row.createdDatetime;
                    this.dummyId = row.dummyId;
                    this.personId = row.personId;
                    this.data = JSON.parse(row.data);
                    break;
            }
        } else {
            throw new Error("You need to specify exactly the entire row that was supplied from the database to parse the session");
        }
    }
    get waveform() {
        switch(this.version) {
            default:
            case "1.0.0":
                //Accumulate the x-value
                if (!this.data.newWaveform) {
                    //Calculate this new waveform
                    var len = this.data.waveform.length;

                    //Predefine array
                    this.data.newWaveform = Array(this.data.waveform.length);

                    this.data.newWaveform[0] = {x: this.data.waveform[0][0], y: (this.data.waveform[0][1] / 1024) * 70};
                    var i;
                    for(i=1; i<len; i++) {
                        this.data.newWaveform[i] = {x: this.data.waveform[i][0], y: (this.data.waveform[i][1] / 1024) * 70};
                        this.data.newWaveform[i].x += this.data.newWaveform[i-1].x;
                    }

                    //Now we have the accumulated value for x (roughly how long the session actually went), we can normalise it
                    let max = this.data.newWaveform[len-1].x;
                    //console.log("max: ", max);
                    for(i=0; i<len; i++) {
                        this.data.newWaveform[i].x /= max;

                        //Let's make it a bit easier on the decimal places, so that it can be draw
                        this.data.newWaveform[i].x = (this.data.newWaveform[i].x * 60).toFixed(0);
                    }
                }
                return this.data.newWaveform;
        }
    }
    get frequencyWaveform() {
        let calcWaveform = this.waveform;
        return null;
    }
    get compressionCount() {
        switch(this.version) {
            default:
            case "1.0.0":
                return this.data.compressionCount;
        }
    }
    get compressionGoodCount() {
        switch(this.version) {
            default:
            case "1.0.0":
                return this.data.compressionGood;
        }
    }
    get sessionTime() {
        switch(this.version) {
            default:
            case "1.0.0":
                return this.data.sessionTime;
        }
    }
    get compressionFrequency() { //Compressions / minute
        return this.compressionGoodCount / (this.sessionTime / 60000) //ms to minute
    }
}

export default Session;