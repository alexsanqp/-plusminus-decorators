# @plusminus/decorators

A context menu built with Angular (6) inspired by [ui.bootstrap.contextMenu](https://github.com/Templarian/ui.bootstrap.contextMenu).  Bootstrap classes are included in the markup, but there is no explicit dependency on Bootstrap. [Demo](https://isaacplmann.github.io/ngx-contextmenu/) [Stackblitz example](https://stackblitz.com/edit/ngx-contextmenu-example)

## Installation

- `npm install @plusminus/decorators`

## Usage

#### Mixins

Decorator that helps you implement incomplete multiple inheritance.

**Mixin** classes do not support CIs because they are executed earlier. Used to refine the behavior
of other classes, not intended to spawn self-used objects. Mixins are useful for bringing common
functionality into a single place and being reusable.

The parent class needs to implement the mixin classes (only the declaration of properties or methods)
so that the project can be built without errors at the compilation stage.

If the mixin class has private fields or methods that you do not want
to declare in the parent class, then you can create your own type/interface and declare it:

If you want to pass parameters to the constructor of the mixin class,
you need to pass an array where the first element will be the mixin class itself,
and all subsequent elements are its parameters.

```ts
  import { Mixins } from '@plusminus/decorators';

  class SubscriptionMixin {
     // ...
  }
 
  class GoodbyeMixin {
     // ...
  }
 
  class GreeterMixin {
     public get fullName(): string {
       return `${this.firstName} ${this.surName}`;
     }
 
     public constructor(private firstName: string, private surName: string) {
     }
 
     public greet(): string {
       return `Hello, ${this.firstName} ${this.surName}!`;
     }
  }
 
  type GreeterMixinType = Omit<GreeterMixin, 'firstName' | 'surName'>;
  // or
  interface GreeterInterface extends Omit<GreeterMixin, 'firstName' | 'surName'> {}
 
  @Component({...})
  @Mixins([
     SubscriptionMixin,
     GoodbyeMixin,
     [GreeterMixin, 'John', 'Wick'],
  ])
  class HelloWorld implements GreeterMixinType {
     public fullName: string;
     public greet: () => string;
     // Other declarations: SubscriptionMixin, GoodbyeMixin
 
     public constructor() {
       alert(this.greet());
     }
 }
```

#### Memorize

#### OverrideProps
