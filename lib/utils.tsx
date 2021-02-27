import { Quad } from "rdf-js";

import {
    createSolidDataset,
    getSolidDataset,
    getThingAll,
    getUrl,
    SolidDataset
} from "@inrupt/solid-client";

import {RDF} from "@inrupt/lit-generated-vocab-common";

import axios from 'axios';

/**
 * @returns All Things from a given dataset if they are of parameterised type
 */
export const getFilteredThings = (dataset, propertyType) => {
    let ret = [];
    getThingAll(dataset).forEach((thing) => {
        const TYPE = getUrl(thing, RDF.type);
        if(propertyType == TYPE) ret.push(thing);
    });
    return ret
};

export async function turtleToTriples(
    raw: string
  ): Promise<Quad[]> {
    const format = "text/turtle";
    const n3 = await loadN3();
    const parser = new n3.Parser({ format: format });
  
    const parsingPromise = new Promise<Quad[]>((resolve, reject) => {
      const parsedTriples: Quad[] = [];
      parser.parse(raw, (error, triple, _prefixes) => {
        if (error) {
          return reject(error);
        }
        if (triple) {
          parsedTriples.push(triple);
        } else {
          resolve(parsedTriples);
        }
      });
    });
  
    return parsingPromise;
  }
  
  async function loadN3() {
    // When loaded via Webpack or another bundler that looks at the `modules` field in package.json,
    // N3 serves up ES modules with named exports.
    // However, when it is loaded in Node, it serves up a CommonJS module, which, when imported from
    // a Node ES module, is in the shape of a default export that is an object with all the named
    // exports as its properties.
    // This means that if we were to import the default module, our code would fail in Webpack,
    // whereas if we imported the named exports, our code would fail in Node.
    // As a workaround, we use a dynamic import. This way, we can use the same syntax in every
    // environment, where the differences between the environments are in whether the returned object
    // includes a `default` property that contains all exported functions, or whether those functions
    // are available on the returned object directly. We can then respond to those different
    // situations at runtime.
    // Unfortunately, that does mean that tree shaking will not work until N3 also provides ES modules
    // for Node, or adds a default export for Webpack. See
    // https://github.com/rdfjs/N3.js/issues/196
    const n3Module = await import("n3");
    /* istanbul ignore if: the package provides named exports in the unit test environment */
    if (typeof n3Module.default !== "undefined") {
      return n3Module.default;
    }
    return n3Module;
  }

export const parseTurtleToSolidDataset = async (turtle: string) : Promise<SolidDataset> => {
    const triples = await turtleToTriples(turtle);
    const resource = createSolidDataset();
    triples.forEach((triple) => resource.add(triple));

    return resource;
}

/**
 * @param uri: the URI of the Thing which I want to describe 
 * @returns content returned from the server (should be a plain text string). Null if the server had no content
*/
export const getContentRequest = async (contentServerURL: string, uri: string) : Promise<any> => {
    /*let url = new URL(contentServerURL)
    let params = [['uri', uri]]
    url.search = new URLSearchParams(params).toString();*/

    //return getSolidDataset(contentServerURL, );
    return await axios.get(contentServerURL, { params: { uri: uri } });
}