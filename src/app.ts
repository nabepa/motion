import { Component } from './components/component.js';
import { InputDialog } from './components/dialog/dialog.js';
import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import {
  Composable,
  PageComponent,
  PageItemComponent,
} from './components/page/page.js';

class App {
  private readonly page: Component & Composable;

  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attatchTo(appRoot);

    const image = new ImageComponent(
      'Image Title',
      'https://picsum.photos/600/300'
    );
    this.page.addChild(image);

    const video = new VideoComponent(
      'Video Title',
      'https://youtu.be/dG6AcrSSKlQ'
    );
    this.page.addChild(video);

    const note = new NoteComponent('Note Title', 'Hello World :)');
    this.page.addChild(note);

    const todo = new TodoComponent('Todo Title', 'English');
    this.page.addChild(todo);

    const imageBtn = document.querySelector('#new-image')! as HTMLButtonElement;
    imageBtn.addEventListener('click', () => {
      const dialog = new InputDialog();

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(document.body);
      });

      dialog.setOnSubmitListener(() => {
        // make section and add on section
        dialog.removeFrom(document.body);
      });

      dialog.attatchTo(document.body);
    });
  }
}

// !와 as를 함께 쓰는 이유는?
new App(document.querySelector('.document')! as HTMLElement);
