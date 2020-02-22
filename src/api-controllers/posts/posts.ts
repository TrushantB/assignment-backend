import IApiController from '@framework/interfaces/api-controller';
import ExtApiController from '@framework/decorators/extended-api-controller';
import InjectRepository from '@framework/decorators/inject-repository';
import ExtApiAction from '@framework/decorators/extended-api-action';
import Message, { MessageObject } from '@domain-objects/post/message';
import { AuthorObject } from '@domain-objects/post/author';
import IMessageRepository from '@interfaces/repositories/message-repository';
import { Identifier } from '@framework/ddd';

const { ObjectId } = require('mongodb');
import {getDb} from '@framework/database/db';

interface PostMessageResponse {
  success: boolean;
  data: MessageObject[];
  links: {
    self: string;
  };
}

@ExtApiController<PostsController>('posts')
export default class PostsController extends IApiController {
  @InjectRepository('MessageRepository') private messages: IMessageRepository;

  @ExtApiAction('get',
    '/',
    [],
    'messages.read',
    true)
  public async getMessagesAction(): Promise<void> {
    const bodyObject: {
      data: MessageObject[];
    } = {
      /*
        TODO: Fill this array with messages, using IMessageRepository.
      */
     data: []
      // data: [{
      //   '_id': 'string',
      //   'message': 'message',
      //   'author': {
      //     '_id': 'string',
      //     'name': 'string',
      //     'is-admin': false
      //   }
      //   ,
      //   'replies': [],
      //   'created': 1
      // }],
    };
    try{
      // specify the DB's name
          const db = getDb();

          this.response.setStatusCode(200);   
          this.Response.setBody( {
            data:{
              results: await db.collection('posts').find({}).toArray()
            },

          });

      // close connection
      //client.close();
    }
    catch(err){
      //console.log(`error while getMessage ${err}`);
      this.Response.setStatusCode(500);
      this.Response.setBody({
        success: false,
        data: {
          message: `Error: ${err.message}`,
        },
      });
    }
  
  }

  
  @ExtApiAction('post',
    '/',
    ['message','name','id','isAdmin','created'],
    'messages.write',
    true)
    public async postMessageAction(message:string,name:string,id:string,isAdmin:boolean,created:string): Promise<void> {
      try {
        console.log(message);
        
        this.Response.setStatusCode(201);
        this.Response.setBody({
          data:{
            message:message,
            results:  getDb().collection('posts').insertOne({
              author: {_id: id, name: name, 'is-admin': isAdmin},
              message: message,
              created: created,
              replies:[]
            }),
          },
        });
      } catch (err) {
        this.Response.setStatusCode(500);
        this.Response.setBody({
          success: false,
          data: {
            message: `Error: ${err.message}`,
          },
        });
      }
    }

  //                       Explanation of the @ExtApiAction compound decorator
  @ExtApiAction(
    //                     This is the HTTP method used for this action.
    'put',
    /*                     This is the endpoint used to reach this action.
                           It combines with the controller module and API root, in this case /posts/:id
                           The : in front of id suggests this is a variable.
    */
    '/:id',
    /*                     This array lists the names of the arguments for the action,
                           in the order they appear in the argument list.
    */
    [
      'id',
      'reply',
      'name',
      'userId',
      'isAdmin',
      'created',
    ],
    /*                     This is the permissions required for this endpoint. Path variables can be used here,
                           in which case the name is substituted for the parameter.
    */
    'messages.write',
    /*                     True if endpoint requires authentication.
                           Required for permissions, since permissions are stored in JWT.
    */
    true,
  )
  public async putReplyAction(id: string, reply: string,name:string,userId:string,isAdmin:boolean,created:string): Promise<void> {
    try {
      const message: Message = null;
      const replyMessage: Message = null;
      
      /*
        TODO: Add reply to message with given id and update database.
      */
     var ObjectID = require('mongodb').ObjectID;
      this.response.setBody({
        success: true,
        data: {
          message: `Reply added to post ${id}`,
          results: getDb().collection('posts').update({"_id":ObjectID(id)}, {$push:{"replies":{
              _id:new ObjectID(),
              author: {userId: userId, name: name, 'is-admin': isAdmin},
              message: reply,
              created: created,
          }}})
        },
        links: {
          self: `/api/posts/${id}`,
          message:reply
        },
      });
    } catch (error) {
      this.response.setStatusCode(400);
      this.response.setBody({
        success: false,
        data: {
          message: `Post ${id} not found.`,
        },
      });
    }
  }

  @ExtApiAction('delete',
    '/:id',
    ['id','replyId'],
    'messages.delete',
    true)
  public async deleteMessageAction(id: string,replyId:string): Promise<void> {
    try {  
      if(!replyId) {
        console.log("delete action called");
        getDb().collection('posts').remove(
          {'_id': ObjectId(id)}
      );
    }
      else {
        console.log("replay action called");

        getDb().collection('posts').update(
          {'_id': ObjectId(id)}, 
          { $pull: { "replies" : { '_id': ObjectId(replyId) } } }
      );
      }
      } catch (err) {
        this.Response.setStatusCode(500);
        this.Response.setBody({
          success: false,
          data: {
            message: `Error: ${err.message}`,
          },
        });
      }
  }


//   @ExtApiAction('delete',
//   '/:id',
//   ['id','replyId'],
//   'messages.delete',
//   true)
// public async deleteReplyAction(id: string,replyId:string): Promise<void> {
//  try {  
//   console.log("replay action called");

//   getDb().collection('posts').update(
//     {'_id': ObjectId(id)}, 
//     { $pull: { "replies" : { '_id': ObjectId(replyId) } } }
// );
//   } catch (err) {
//     this.Response.setStatusCode(500);
//     this.Response.setBody({
//       success: false,
//       data: {
//         message: `Error: ${err.message}`,
//       },
//     });
//   }
  
// }
}
