import React from 'react';
import { formatDate, monthNames } from '@utils/helpers';
import R from 'ramda/src/groupBy';
import { Link, withPrefix } from 'gatsby';

const Updates = ({ updates }: IUpdates) => {
  const updatesForThisService = updates.map(update => {
    const formattedDate = formatDate(new Date(update.date));

    // if (formattedDate === formatDate(new Date())) {

    //   if (new Date(update.date).getTime() > new Date().getTime()) {
    //   } else {
    //     // formattedDate = moment(update.date).fromNow();
    //   }
    // }

    return Object.assign({}, update, {
      date: formattedDate,
    });
  });

  const byMonth = R(update => {
    return `${monthNames[new Date(update.date).getMonth()]} ${new Date(update.date).getFullYear()}`;
  });

  const ranges = byMonth(updatesForThisService);

  const formattedUpdates = Object.keys(ranges)
    .sort((a, b) => new Date(ranges[b][0].date) - new Date(ranges[a][0].date))
    .map(monthKey => [
      {
        date: monthKey,
        changes: ranges[monthKey]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map(update => ({
            time: update.date,
            title: update.title,
            description: update.description,
            link: update.link,
          })),
      },
    ]);

  return (
    <div className="flex flex-col py-8">
      {formattedUpdates.map(update =>
        update.map(item => (
          <div key={item.changes[0].title} className="flex flex-col w-full">
            <h3 className="text-3xl font-bold mt-4 mb-4">{item.date}</h3>
            {item.changes.map(change => (
              <div key={change.title} className="block border-t border-secondary border-opacity-75">
                <p className="bg-secondary text-white p-2 inline-block mb-3">{change.time}</p>
                <h4 className="text-xl font-bold mb-3">{change.title}</h4>
                <p className="mb-3" dangerouslySetInnerHTML={{ __html: change.description }} />
                <div className="flex flex-col mb-8">
                  {change.link.map(l => {
                    const data = l.flatData;
                    let link;
                    let external = false;
                    if (l.__typename === 'Squidex_Benefitpage') {
                      const catSlug = l.flatData.parentCategory[0].flatData.slug;
                      link = `${catSlug}/${data.slug}`;
                    }
                    if (l.__typename === 'Squidex_Categorypage') {
                      link = `/${data.slug}`;
                    }
                    if (l.__typename === 'Squidex_Externallinks') {
                      external = true;
                      link = data.url;
                    }
                    if (!external) {
                      return (
                        <Link className="underline hover:text-primary" key={`update-${l.id}`} to={`/${link}`}>
                          {data.name}
                        </Link>
                      );
                    }
                    return (
                      <a className="underline hover:text-primary" target="_blank" key={`update-${l.id}`} href={link}>
                        {data.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )),
      )}
    </div>
  );
};

export default Updates;
