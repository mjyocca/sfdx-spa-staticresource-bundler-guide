import { createElement, register } from 'lwc';
import { registerWireService } from '@lwc/wire-service';
import MyApp from 'my/app';

registerWireService(register);
const app = createElement('my-app', { is: MyApp });
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#main').appendChild(app);
