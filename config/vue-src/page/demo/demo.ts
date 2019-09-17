import Component, { mixins } from "vue-class-component";
import {
  Emit,
  Inject,
  Model,
  Prop,
  Provide,
  Vue,
  Watch,
} from "vue-property-decorator";
import BasePage from "../BasePage";

interface I<%= upCaseClassName%>Page {
  /**
   * 
   */
  fetchData(): void;
}

@Component({
  components: {},
  name: "<%= upCaseClassName%>",
})
export default class <%= upCaseClassName%>Page extends mixins(BasePage) implements I<%= upCaseClassName%>Page {

  title: string = "<%= lineClassName%>";
  fetchData() {
    //
  }
  mounted() {
    //
  }
}
