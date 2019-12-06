import { library, dom } from "@fortawesome/fontawesome-svg-core";
// import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faPen, faUser, faStickyNote } from "@fortawesome/free-solid-svg-icons";

export class FontAwesomeLoader {
  static loadFontAwesome() {
    library.add(faUser, faPen, faStickyNote);
    dom.watch();
  }
}