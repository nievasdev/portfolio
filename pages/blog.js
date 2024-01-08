import { Card, CardBody, Divider } from "@nextui-org/react";
const blogJson = require("../public/blog.json");
import Link from 'next/link'

export default function Blog() {

    return <div className="h-full text-center">
        <p
            className="text-5xl sm:text-5xl md:text-7xl lg:text-7xl xl:text-7xl 2xl:text-7xl font-sans font-black text-ellipsis z-40 group "
        >
            Blog
        </p>
        <div className="mt-10 content-center mx-auto place-items-center md:w-3/4">
            {
                blogJson.map(post => {
                    return <Card
                        key={post.id}
                        className="w-full bg-spacial-2 mb-8">
                        <CardBody>
                            <Link href={"/blog/" + post.id} >
                                <p className="text-xl sm:text-xl md:text-3xl lg:text-3xl xl:text-3xl 2xl:text-3xl font-sans font-black text-ellipsis z-40">{post.title}</p>
                            </Link>

                        </CardBody>
                    </Card>

                })
            }
        </div>
    </div>
}