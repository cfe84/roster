import { JsonSerializer } from "../src/utils/JsonSerializer"
import should from "should";

describe("Serializer", () => {
  it("should deserialize dates properly", () => {
    // given
    const object = {
      id: 1,
      text: "text1",
      sub: {
        value: "asdlaksd"
      },
      date: new Date(2018, 0, 1)
    }
    // when
    const serialized: string = JsonSerializer.serialize(object);
    const deserialized: any = JsonSerializer.deserialize(serialized);
    // then
    should(deserialized).not.exactly(object);
    should(deserialized).be.deepEqual(object);
  });

  it("should clean dates", () => {
    // given
    const object = {
      id: 1,
      text: "text1",
      bli: null,
      arr: [new Date(2010, 4, 19), "Lolipop", 1, false, null, {}, {
        lolipop: 123,
        date: new Date(2011, 5, 1)
      }],
      sub: {
        value: new Date(2017, 1, 3)
      },
      date: new Date(2018, 0, 1)
    }
    // when
    const serialized: string = JSON.stringify(object);
    const deserialized: any = JSON.parse(serialized);
    const cleaned = JsonSerializer.clean(deserialized);
    // then
    should(cleaned).be.deepEqual(object);
  })
})