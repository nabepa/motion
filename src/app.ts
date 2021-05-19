import { Component } from './components/component';
import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import { Composable, PageComponent } from './components/page/page.js';

class App {
  private readonly page: Component & Composable;

  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent();
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
  }
}

// !와 as를 함께 쓰는 이유는?
new App(document.querySelector('.document')! as HTMLElement);
