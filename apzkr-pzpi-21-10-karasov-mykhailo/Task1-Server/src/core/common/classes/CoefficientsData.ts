export default class CoefficientsData {

    public totalCoefficient: number = -1;

    constructor (
        public activityId: number,
        public temperatureCoefficient: number,
        public pulseCoefficient: number,
        public workTimeCoefficient: number,
        public complexityCoefficient: number,
    ) {}
}