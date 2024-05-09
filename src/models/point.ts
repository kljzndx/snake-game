export class Point{
    constructor(public x:number, public y:number){
    }

    equals(other:Point){
        return this.x==other.x&&this.y==other.y
    }
}