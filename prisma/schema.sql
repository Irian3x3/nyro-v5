CREATE TABLE public.guild (
	id text PRIMARY NOT NULL,
	"data" text NULL
);

CREATE TABLE public.tags (
	guild text NULL,
	author text NULL,
	content TEXT NULL,
	createdat date NULL DEFAULT now(),
	uses int NULL DEFAULT 0,
	name text NULL,
	editedat date NULL DEFAULT now(),
	editedby text NULL
);
