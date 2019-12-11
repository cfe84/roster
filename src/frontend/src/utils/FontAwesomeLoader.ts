import { library, dom } from "@fortawesome/fontawesome-svg-core";
// import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faPen, faUser, faStickyNote, faArrowLeft, faTimes, faSave, faPlus, faComments } from "@fortawesome/free-solid-svg-icons";

export class FontAwesomeLoader {
  static loadFontAwesome() {
    library.add(faUser, faPen, faStickyNote, faArrowLeft, faTimes, faSave, faPlus, faComments);
    dom.watch();
  }
}