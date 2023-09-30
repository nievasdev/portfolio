import { useRouter } from 'next/router';

const blogJson = require('../../public/blog.json');

export default function SelectedBlog() {
  const router = useRouter();
  const id = router.query.id;

  const [blogSelected] = blogJson.filter((post) => post.id === id);

  return (
    <>
      {blogSelected && (
        <div key={blogSelected.title} className='sm:ml-10 sm:mr-10 pt-10 items-center place-content-center pb-5'>
          <div className='flex flex-col gap-1 text-5xl text-center'>
            {blogSelected.title}
          </div>
          <div>
            <div className='place-content-center items-center mt-10 h-full w-full'>
              <div className='p-10'>
                {blogSelected?.texts.map((text, index) => {
                  return (
                    <p key={index} className='mb-4'>
                      {text}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}