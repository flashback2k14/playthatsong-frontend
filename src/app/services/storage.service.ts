import { Injectable } from "@angular/core";
import { NotifyMessage } from "../models/notify-message";
import { LSItem } from "../models/ls-item";


@Injectable()
export class StorageService {
  /**
   * storage keys
   */
  TOKENKEY: string = "PLAYTHATSONGAUTHTOKEN";
  EXPIREKEY: string = "PLAYTHATSONGAUTHEXPIRE"

  /**
   * Save Items
   * @param items [LSItem[]] - items to save 
   * @returns Promise [NotifyMessage]
   */
  saveMany (items: LSItem[]): Promise<NotifyMessage> {
    return new Promise((resolve, reject) => {
      // check if items availiable
      if (!items) {
        reject(new NotifyMessage(false, "No items availiable to save!"));
      }
      // iterate over items and set into localStorage
      items.forEach(item => {
        localStorage.setItem(item.key, item.value);
      });
      // return success message
      resolve(new NotifyMessage(true, "All items successfully saved!"));
    });
  };

  /**
   * Save Item
   * @param item [LSItem] - items to save 
   * @returns Promise [NotifyMessage]
   */
  saveOne (item: LSItem): Promise<NotifyMessage> {
    return new Promise((resolve, reject) => {
      // check if item availiable
      if (!item) {
        reject(new NotifyMessage(false, "No items availiable to save!"));
      }
      // save item
      localStorage.setItem(item.key, item.value);
      // return success message
      resolve(new NotifyMessage(true, "All items successfully saved!"));
    });
  };

  /**
   * Get all Items from keys
   * @param keys [string[]] - key name
   * @returns Promise [LSItem[]]
   */
  getMany (keys: string[]): Promise<LSItem[]> {
    return new Promise((resolve, reject) => {    
      // check if keys availiable
      if (!keys) {
        reject(new NotifyMessage(false, "No keys availiable!"));
      }
      // init return array
      let foundItems: LSItem[] = new Array<LSItem>();
      // iterate over keys and add to the array
      keys.forEach((item, i) => {
        foundItems.push(new LSItem(item,localStorage.getItem(item)));
      });
      // return items array
      resolve(foundItems);
    });
  };

  /**
   * Get all Item from key
   * @param key [string] - key name
   * @returns Promise [LSItem]
   */
  getOne (key: string): Promise<LSItem> {
    return new Promise((resolve, reject) => {    
      // check if key availiable
      if (!key) {
        reject(new NotifyMessage(false, "No keys availiable!"));
      }
      // return item
      resolve(new LSItem(key,localStorage.getItem(key)));
    });
  };

  /**
   * Remove Items from keys
   * @param keys [string[]] - key name
   * @returns Promise [NotifyMessage]
   */
  removeMany (keys: string[]): Promise<NotifyMessage> {
    return new Promise(function (resolve, reject) {
      // check if keys availiable
      if (!keys) {
        reject(new NotifyMessage(false, "No keys availiable!"));
      }
      // iterate over keys and add to the array
      keys.forEach(item => {
        localStorage.removeItem(item);
      });
      // return success message
      resolve(new NotifyMessage(true, "All items successfully removed!"));
    });
  };

  /**
   * Remove Item from key
   * @param key [string] - key name
   * @returns Promise [NotifyMessage]
   */
  removeOne (key: string): Promise<NotifyMessage> {
    return new Promise(function (resolve, reject) {
      // check if key availiable
      if (!key) {
        reject(new NotifyMessage(false, "No keys availiable!"));
      }
      // remove item
      localStorage.removeItem(key);
      // return success message
      resolve(new NotifyMessage(true, "All items successfully removed!"));
    });
  };
}