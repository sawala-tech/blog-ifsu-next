import { Layout } from '@/components/Layout'
import { Markdown } from '@/components/Markdown'
import { Container, Flex, Grid, Text } from '@mantine/core'
import api from '@services/api'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons'
import Link from 'next/link'

/**
 *
 * @param { data }
 * data diambil dari getServerSideProps
 * @returns
 */
const BlogDetail = ({ data }) => {
  // ganti &nbsp; (atau bisa disebut non-breakable space) dengan string kosong
  const content = data.attributes.content.replaceAll('&nbsp;', '')

  return (
    <Layout withFooter withHeader>
      <Container size="md" my={75} mx="auto">
        <Flex mt="7rem" direction="column">
          <Link href="/">
            <Text size="md" color="gray.7" sx={{ cursor: 'pointer' }}>
              Kembali
            </Text>
          </Link>
          <Text fw="700" size={34} color="gray.9" my="lg">
            {data?.attributes?.title}
          </Text>
        </Flex>

        <Markdown children={content} />

        <Grid mx="auto" justify="center" mt={80}>
          <Grid.Col md={5} sx={{ cursor: 'pointer' }}>
            {data?.attributes?.previousBlog && (
              <Link href={`/blog/${data?.attributes?.previousBlog?.slug}`}>
                <Flex direction="row" gap="xs" px={10} py={10} bg="gray.1" align="center" sx={{ borderRadius: '6px' }}>
                  <Text lineClamp={1} sx={{ flex: '1 1 0%' }} fw={600}>
                    {data?.attributes?.previousBlog?.title}
                  </Text>
                  <IconChevronLeft />
                </Flex>
              </Link>
            )}
          </Grid.Col>
          <Grid.Col md={5} sx={{ cursor: 'pointer' }}>
            {data?.attributes?.nextBlog && (
              <Link href={`/blog/${data?.attributes?.nextBlog?.slug}`}>
                <Flex direction="row" gap="xs" px={10} py={10} bg="gray.1" align="center" sx={{ borderRadius: '6px' }}>
                  <IconChevronRight />
                  <Text lineClamp={1} sx={{ flex: '1 1 0%' }} fw={600}>
                    {data?.attributes?.nextBlog?.title}
                  </Text>
                </Flex>
              </Link>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </Layout>
  )
}

/**
 * getServerSideProps memungkinkan kita untuk memuat data dari server secara ssr
 * ssr = server side rendering
 * @param {*} ctx context api bawaan dari nextjs
 * @returns
 */
export const getServerSideProps = async (ctx) => {
  // ambil slug dari url
  // slug digunakan untuk mengambil detail blog dari api
  const query = ctx.query
  const slug = query.slug

  // fetch data dari api menggunakan axios
  const data = await api
    .get(`/api/blogs/${slug}`)
    .then(({ data }) => data) // jika api berhasil dan data ada, maka kita ambil datanya
    .catch((e) => {
      console.log(e)
      // jika api tidak berhasil dan data tidak ada, maka kita tidak mengembalikan apa apa
      return null
    })
  // jika data kosong, kita arahkan ke halaman daftar blog
  if (!data || Object.keys(data).length === 0) {
    return {
      // redirect = bawaan nextjs, untuk mengarahkan ke halaman tertentu
      redirect: {
        permanent: false, // jika true, maka selamanya halaman ini akan diarahkan ke halaman lain
        destination: `/blog`
      }
    }
  }
  // jika data ada, muat data halaman detail blog
  return {
    props: {
      data: data?.data
    }
  }
}

export default BlogDetail
