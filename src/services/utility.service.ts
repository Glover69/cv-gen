// src/app/services/utility.service.ts
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  sanitizeData(data: any): any {
    // Use WeakMap to handle circular references
    const map = new WeakMap();
    return this.deepClone(data, map);
  }

  private deepClone(obj: any, map: WeakMap<object, any>): any {
    // Handle null or primitive types
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    // Check if the object has already been cloned
    if (map.has(obj)) {
      return map.get(obj);
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      const arrClone: any[] = [];
      map.set(obj, arrClone);
      for (const item of obj) {
        arrClone.push(this.deepClone(item, map));
      }
      return arrClone;
    }

    // Handle objects and skip non-serializable objects
    const clonedObj: { [key: string]: any } = {};
    map.set(obj, clonedObj);
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        // Skip non-serializable values like Observables, Subscriptions, and functions
        if (
          value instanceof Observable ||
          value instanceof Subscription ||
          typeof value === 'function'
        ) {
          continue;
        }

        // Recursively clone other values
        clonedObj[key] = this.deepClone(value, map);
      }
    }
    return clonedObj;
  }
}
