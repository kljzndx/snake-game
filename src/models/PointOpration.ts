import { Point } from "./point"


interface PointOprationCore {
    (point: Point): Point
}

const ops: { left: PointOprationCore, right: PointOprationCore, up: PointOprationCore, down: PointOprationCore } = {
    left: (point: Point) => new Point(point.x - 1, point.y),
    right: (point: Point) => new Point(point.x + 1, point.y),
    up: (point: Point) => new Point(point.x, point.y - 1),
    down: (point: Point) => new Point(point.x, point.y + 1),
}

function execOpration(currentPoint: Point, maxPoint: Point, opration: PointOprationCore): Point {
    const cp = opration(currentPoint)

    switch (cp.x) {
        case -1:
            cp.x = maxPoint.x
            break;

        case maxPoint.x + 1:
            cp.x = 0
            break;
    }

    switch (cp.y) {
        case -1:
            cp.y = maxPoint.y
            break;

        case maxPoint.y + 1:
            cp.y = 0
            break;
    }

    return cp
}

export type{
    PointOprationCore,
}
export{
    ops,
    execOpration
}