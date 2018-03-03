import { Interceptor, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Interceptor()
export class TransformInterceptor implements NestInterceptor {
    intercept(dataOrRequest, context: ExecutionContext, stream$: Observable<any>): Observable<any> {
        // wrap the response in an object with 'data'
        return stream$.map((data) => ({ data }));
    }
}