import { Array2D } from "../Array2D";
import { Rect } from "../RectV";
import { Vec } from "../vec";

describe("Array2D()", () => {
    test("normal", () => {
      const array = new Array2D(3, 2, "fill");
      expect(array.width).toStrictEqual((3));
      expect(array.height).toStrictEqual((2));
      expect(array.bounds).toStrictEqual((new Rect(0, 0, 3, 2)));
      expect(array.size).toStrictEqual((new Vec(3, 2)));
      expect(array.get(0, 0)).toStrictEqual(("fill"));
    });

    test("empty", () => {
      const array = new Array2D(0, 0, 1);
      expect(array.width).toStrictEqual((0));
      expect(array.height).toStrictEqual((0));
      expect(array.bounds).toStrictEqual((new Rect(0, 0, 0, 0)));
      expect(array.size).toStrictEqual((new Vec(0, 0)));
    });
  });

  describe("Array2D.generated", () => {
    test("normal", () => {
      const calls: Vec[] = [];
      const array = new Array2D(2, 3, (pos) => {
        calls.push(pos);
        return pos.x * 100 + pos.y;
      });

      expect(array.width).toStrictEqual((2));
      expect(array.height).toStrictEqual((3));
      expect(array.bounds).toStrictEqual((new Rect(0, 0, 2, 3)));
      expect(array.size).toStrictEqual((new Vec(2, 3)));
      expect(array.get(0, 0)).toStrictEqual((0));
      expect(array.get(1, 2)).toStrictEqual((102));

      expect(
          calls).toBe([
            new Vec(0, 0),
            new Vec(1, 0),
            new Vec(0, 1),
            new Vec(1, 1),
            new Vec(0, 2),
            new Vec(1, 2),
          ]);
    });

    test("empty", () => {
      const calls: Vec[] = [];
      const array = new Array2D(0, 0, (pos) => {
        calls.push(pos);
        return pos.x * 100 + pos.y;
      });

      expect(array.width).toStrictEqual((0));
      expect(array.height).toStrictEqual((0));
      expect(array.bounds).toStrictEqual((new Rect(0, 0, 0, 0)));
      expect(array.size).toStrictEqual((new Vec(0, 0)));
      expect(calls.length).toBe(0);
    });

    test("1x1", () => {
      const calls: Vec[] = [];
      const array = new Array2D(1, 1, (pos) => {
        calls.push(pos);
        return pos.x * 100 + pos.y;
      });

      expect(array.width).toStrictEqual((1));
      expect(array.height).toStrictEqual((1));
      expect(array.bounds).toStrictEqual((new Rect(0, 0, 1, 1)));
      expect(array.size).toStrictEqual((new Vec(1, 1)));
      expect(array.get(0, 0)).toStrictEqual((0));
      expect(calls).toStrictEqual(([new Vec(0, 0))));
    });
  });

  describe("index operator", () => {
    test("[]", () => {
      const array = new Array2D(3, 2, (pos) => pos.x * 100 + pos.y);

      expect(array.at(new Vec(0, 0))).toStrictEqual((0));
      expect(array.at(new Vec(1, 0))).toStrictEqual((100));
      expect(array.at(new Vec(2, 0))).toStrictEqual((200));
      expect(array.at(new Vec(0, 1))).toStrictEqual((1));
      expect(array.at(new Vec(1, 1))).toStrictEqual((101));
      expect(array.at(new Vec(2, 1))).toStrictEqual((201));
    });

    test("[] out of bounds", () => {
      const array = new Array2D(3, 2, 0);
      expect(() => array.at(new Vec(-1, 0))).toThrowError(RangeError);
      expect(() => array.at(new Vec(0, -1))).toThrowError(RangeError);
      expect(() => array.at(new Vec(3, 0))).toThrowError(RangeError);
      expect(() => array.at(new Vec(0, 2))).toThrowError(RangeError);
    });

    test("[]=", () => {
      const array = new Array2D(3, 2, 0);
      array.at(new Vec(0, 0)) = 1;
      array.at(new Vec(1, 0)) = 2;
      array.at(new Vec(0, 1)) = 3;
      array.at(new Vec(2, 1)) = 4;

      expect(array.at(new Vec(0, 0))).toStrictEqual((1));
      expect(array.at(new Vec(1, 0))).toStrictEqual((2));
      expect(array.at(new Vec(0, 1))).toStrictEqual((3));
      expect(array.at(new Vec(2, 1))).toStrictEqual((4));
    });

    test("[]= out of bounds", () => {
      const array = new Array2D(3, 2, 0);
      expect(() => array.at(new Vec(-1, 0)) = 1).toThrowError(RangeError);
      expect(() => array.at(new Vec(0, -1)) = 1).toThrowError(RangeError);
      expect(() => array.at(new Vec(3, 0)) = 1).toThrowError(RangeError);
      expect(() => array.at(new Vec(0, 2)) = 1).toThrowError(RangeError);
    });
  });

  describe("get()", () => {
    test("get()", () => {
      const array = new Array2D(3, 2, (pos) => pos.x * 100 + pos.y);

      expect(array.get(0, 0)).toStrictEqual((0));
      expect(array.get(1, 0)).toStrictEqual((100));
      expect(array.get(2, 0)).toStrictEqual((200));
      expect(array.get(0, 1)).toStrictEqual((1));
      expect(array.get(1, 1)).toStrictEqual((101));
      expect(array.get(2, 1)).toStrictEqual((201));
    });

    test("out of bounds", () => {
      const array = new Array2D(3, 2, 0);
      expect(() => array.get(-1, 0)).toThrowError(RangeError);
      expect(() => array.get(0, -1)).toThrowError(RangeError);
      expect(() => array.get(3, 0)).toThrowError(RangeError);
      expect(() => array.get(0, 2)).toThrowError(RangeError);
    });
  });

  describe("set()", () => {
    test("set()", () => {
      const array = new Array2D(3, 2, 0);
      array.set(0, 0, 1);
      array.set(1, 0, 2);
      array.set(0, 1, 3);
      array.set(2, 1, 4);

      expect(array.get(0, 0)).toStrictEqual((1));
      expect(array.get(1, 0)).toStrictEqual((2));
      expect(array.get(0, 1)).toStrictEqual((3));
      expect(array.get(2, 1)).toStrictEqual((4));
    });

    test("out of bounds", () => {
      const array = new Array2D(3, 2, 0);
      expect(() => array.set(-1, 0, 1)).toThrowError(RangeError);
      expect(() => array.set(0, -1, 1)).toThrowError(RangeError);
      expect(() => array.set(3, 0, 1)).toThrowError(RangeError);
      expect(() => array.set(0, 2, 1)).toThrowError(RangeError);
    });
  });

  test("fill()", () => {
    const array = new Array2D(3, 2, "before");
    array.fill("after");
    expect(array.get(0, 0)).toStrictEqual(("after"));
    expect(array.get(1, 0)).toStrictEqual(("after"));
    expect(array.get(2, 0)).toStrictEqual(("after"));
    expect(array.get(0, 1)).toStrictEqual(("after"));
    expect(array.get(1, 1)).toStrictEqual(("after"));
    expect(array.get(2, 1)).toStrictEqual(("after"));
  });

  test("generate()", () => {
    const array = new Array2D(3, 2, -1);
    array.generate((pos) => pos.x * 100 + pos.y);
    expect(array.get(0, 0)).toStrictEqual((0));
    expect(array.get(1, 0)).toStrictEqual((100));
    expect(array.get(2, 0)).toStrictEqual((200));
    expect(array.get(0, 1)).toStrictEqual((1));
    expect(array.get(1, 1)).toStrictEqual((101));
    expect(array.get(2, 1)).toStrictEqual((201));
  });

  test("iterator", () => {
    const array = new Array2D(3, 2, (pos) => pos.x * 100 + pos.y);
    expect([...array]).toStrictEqual(([0, 100, 200, 1, 101, 201]));
  });