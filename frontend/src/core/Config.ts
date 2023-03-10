import { Node } from '@/core/Node';
import { Node_Int } from '@/core/node/Node_Int';
import { Node_Float } from '@/core/node/Node_Float';
import { Node_String } from '@/core/node/Node_String';
import { Node_Txt2Img } from '@/core/node/Node_Txt2Img';
import { Node_BlendImages } from '@/core/node/Node_BlendImages';
import { Node_Image } from '@/core/node/Node_Image';
import { Node_Vector2 } from '@/core/node/Node_Vector2';
import { Node_Preview } from '@/core/node/Node_Preview';
import { Node_Img2Img } from '@/core/node/Node_Img2Img';

export class Config {
  public static nameToClass(className: string): any {
    if (className == 'Node_Int') return Node_Int;
    if (className == 'Node_Float') return Node_Float;
    if (className == 'Node_String') return Node_String;
    if (className == 'Node_Txt2Img') return Node_Txt2Img;
    if (className == 'Node_Img2Img') return Node_Img2Img;
    if (className == 'Node_BlendImages') return Node_BlendImages;
    if (className == 'Node_Image') return Node_Image;
    if (className == 'Node_Vector2') return Node_Vector2;
    if (className == 'Node_Preview') return Node_Preview;
    return Node;
  }

  public static typeToColor(type: string): string {
    if (type == 'int') return '#992b96';
    if (type == 'float' || type == 'vector2') return 'rgb(98,42,152)';
    if (type == 'image') return '#98462a';
    if (type == 'string') return '#50982a';
    if (type == 'function') return '#1671c7';
    return '#ffffff';
  }
}
