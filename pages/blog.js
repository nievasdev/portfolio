import { Card, CardBody, Divider } from "@nextui-org/react";
const blogJson = require("../public/blog.json");
import Link from 'next/link'

export default function Blog() {

    return <div className="h-full relative text-center">
        <p
            className="text-5xl sm:text-5xl md:text-7xl lg:text-7xl xl:text-7xl 2xl:text-7xl font-sans font-black text-ellipsis z-40 group "
        >
            Blog
        </p>
        <div className="w-full grid_card pt-10">
            {
                blogJson.map(post => {
                    return<Link key={post.id} href={"/blog/" + post.id} >
                        <Card
                        
                        className="max-w-[200px] bg-spacial-2 m-5 pointer button-hover">
                        <CardBody>
                            <p>{post.title}</p>
                        </CardBody>
                    </Card>
                    </Link>

                })
            }
        </div>
    </div>
}