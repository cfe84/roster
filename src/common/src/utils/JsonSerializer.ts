const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.?\d*Z$/;

export class JsonSerializer {
  private static cleanField(key: string, deserializedValue: any): any {
    if (typeof deserializedValue === "string" && dateFormat.test(deserializedValue)) {
      return new Date(deserializedValue)
    } else {
      return deserializedValue
    }
  }

  static serialize(object: any): string {
    return JSON.stringify(object);
  }

  static deserialize<T>(serializedObject: string): T {
    return JSON.parse(serializedObject, this.cleanField);
  }

  static clean(obj: any): any {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || undefined == obj) return obj;

    if (obj instanceof Array) {
      for (var i = 0, len = obj.length; i < len; i++) {
        obj[i] = JsonSerializer.clean(obj[i]);
      }
      return obj;
    }

    if (obj instanceof Object) {
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) obj[attr] = JsonSerializer.clean(obj[attr]);
      }
      return obj;
    }
    return JsonSerializer.cleanField("", obj);
  }
}