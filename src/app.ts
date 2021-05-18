import { PageComponent } from './components/page.js';

class App {
  private readonly page: PageComponent;

  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent();
    this.page.attatchTo(appRoot);
  }
}

// !와 as를 함께 쓰는 이유는?
new App(document.querySelector('.document')! as HTMLElement);
