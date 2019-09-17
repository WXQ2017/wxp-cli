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
import BaseComp from "../BaseComp";

interface I<%= upCaseClassName%>Comp {
  //
}

@Component({
  components: {},
  name: "<%= upCaseClassName%>",
})
export default class <%= upCaseClassName%>Comp extends mixins(BaseComp) implements I<%= upCaseClassName%>Comp {

  title: string = "<%= lineClassName%>";
  
  mounted() {
    //
  }
}
