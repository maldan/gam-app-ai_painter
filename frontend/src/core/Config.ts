import { Node } from '@/core/Node';
import { Node_Int } from '@/core/node/Node_Int';
import { Node_Float } from '@/core/node/Node_Float';
import { Node_String } from '@/core/node/Node_String';
import { Node_Txt2Img } from '@/core/node/Node_Txt2Img';
import { Node_BlendImages } from '@/core/node/Node_BlendImages';
import { Node_Image } from '@/core/node/Node_Image';
import { Node_Vector2 } from '@/core/node/Node_Vector2';

export class Config {
  public static nameToClass(className: string): any {
    if (className == 'Node_Int') return Node_Int;
    if (className == 'Node_Float') return Node_Float;
    if (className == 'Node_String') return Node_String;
    if (className == 'Node_Txt2Img') return Node_Txt2Img;
    if (className == 'Node_BlendImages') return Node_BlendImages;
    if (className == 'Node_Image') return Node_Image;
    if (className == 'Node_Vector2') return Node_Vector2;
    return Node;
  }
}
