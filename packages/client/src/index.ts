import { Foo } from "@models/types";
import { ReceiveType, resolveReceiveType } from "@deepkit/type";

function go() {
	actOnType<Foo>();
}

function actOnType<T>(type?: ReceiveType<T>) {
	type = resolveReceiveType(type);
	console.dir(type);
}

go();
