import { DOMParser, Element, HTMLDocument, HTMLCollection } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const fetchFile = async (url:string): Promise<string> => {
  const fresp = await fetch(url)
  if (fresp.ok) {
    return fresp.text()
  } else throw new Error("Something wrong")
}

const mkDOM = (s: string): HTMLDocument|null => {
  return new DOMParser().parseFromString(s, 'text/html')
}

const BASE_URL = "https://emojipedia.org/search/?q="

type Emo = {
  e: string,
  desc: string,
}


function getEmos(content: string): Emo[] {
  const d = mkDOM(content)
  const getOl = (d: HTMLDocument) => 
    d.getElementsByClassName('search-results')[0]
  const itemToEmo = (li: Element) => 
    ({e: emostr(li), desc: emodesc(li)})
  const emostr = (el: Element) => 
    el.getElementsByClassName('emoji')[0].textContent
  const emodesc = (el: Element) => 
    el.getElementsByTagName('p')[0].textContent
  
  return d ? 
    new Array(...getOl(d).children).map(itemToEmo) : 
    []
}

const emoPrinter = (emo: Emo) => {
    console.log(`${emo.e} - ${emo.desc}`)
}

if (import.meta.main) {
  const url = BASE_URL + Deno.args.join("+")
  getEmos(await fetchFile(url)).map(emoPrinter)
}
