import React, { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, getProfileDataAction } from "../../redux";
import styles from "./styles.module.css";
import { ProviderProfile } from "../../components";

const ProviderProfileDetails = () => {
  const { profile } = useSelector((state: any) => state.user);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (profile?.id) {
      dispatch(getProfileDataAction(profile?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  // const profile: TrainerModal = {
  //   id: 1,
  //   firstname: "Awais",
  //   lastname: "Ali",
  //   avatar: "",
  //   gender: "Male",
  //   description: "This is the description",
  //   // TrainerDetails: TrainerDetailsModal;
  //   // TrainerReviews?: Array<ReviewsGetModel>;
  //   franchise: {
  //     id: 46,
  //     name: "Greenwich Franchise",
  //     geometry: [
  //       [26.114440879758963, 67.69515107734375],
  //       [25.377217652060718, 68.03023408515625],
  //       [25.406992613089074, 67.19527314765625],
  //       [25.84778833790071, 67.13484834296875],
  //     ],
  //     city_id: 320331,
  //     admin: 991,
  //     created_at: "2021-11-19 08:04:32",
  //     updated_at: "2023-03-06 11:28:03",
  //     country_id: 1,
  //     state_id: 10,
  //     review_switch: true,
  //     associate_emails: "",
  //     FranchiseKeys: null,
  //     domain: "palmsprings",
  //     facebook: "https://www.facebook.com/Sendmeatrainer/",
  //     instagram: "https://www.instagram.com/sendmeatrainer/?hl=en",
  //     country: {
  //       id: 1,
  //       name: "United States",
  //       iso: "US",
  //       phone: "1",
  //       capital: "Washington",
  //       currency: "USD",
  //       created_at: "2020-06-15 02:40:58",
  //       updated_at: "2020-06-15 02:40:58",
  //       curency_symbol: "$",
  //     },
  //   },
  //   City: {
  //     name: "city",
  //   },
  //   State: {
  //     name: "state",
  //   },
  //   totalRating: 3,
  //   TrainerDetails: {
  //     id: 1,
  //     user_id: 1,
  //     title: "asdfasdfasdfa",
  //     start_year: "2015",
  //     bio: `
  //     As a certified personal trainer, I have dedicated my life to helping others achieve their fitness goals. I hold a degree in Exercise Science from the University of California, Los Angeles, and have over ten years of experience working with clients of all ages and fitness levels. I am passionate about creating customized fitness plans that take into account each client's unique needs and goals, and I always strive to make workouts fun and engaging.

  //     My training philosophy is rooted in the belief that fitness is not just about physical strength, but also mental and emotional wellness. In addition to strength and conditioning training, I also incorporate mindfulness and stress-reduction techniques into my workouts, to help my clients develop a well-rounded approach to health and wellness. I believe that anyone can achieve their fitness goals with the right mindset and support, and I am committed to providing that support to every client I work with.

  //     In addition to my work as a personal trainer, I am also an avid athlete myself. I have competed in several half marathons and triathlons, and I understand firsthand the hard work and dedication required to achieve athletic goals. I bring this same level of commitment to my work as a trainer, and I am always pushing my clients to reach new heights and exceed their own expectations.

  //     Whether you are just starting your fitness journey or looking to take your training to the next level, I am here to help. With my knowledge, experience, and personalized approach to training, I am confident that I can help you achieve your goals and become the healthiest, happiest version of yourself.`,
  //     Certifications: [
  //       {
  //         id: 1,
  //         trainer_id: 1,
  //         certification_id: 1,
  //         Certification: {
  //           id: 1,
  //           name: "string",
  //         },
  //       },
  //     ],
  //     Specialities: [
  //       {
  //         id: 1,
  //         trainer_id: 1,
  //         speciality_id: 1,
  //         Speciality: {
  //           id: 1,
  //           name: "string",
  //         },
  //       },
  //     ],
  //     Categories: [
  //       {
  //         id: 1,
  //         trainer_id: 1,
  //         category_id: 1,
  //         Category: {
  //           id: 1,
  //           name: "string",
  //           image_url: "string",
  //           arabic_name: "string",
  //         },
  //       },
  //     ],
  //     Languages: [
  //       {
  //         id: 1,
  //         trainer_id: 1,
  //         language_id: 1,
  //         Language: {
  //           id: 1,
  //           name: "string",
  //         },
  //       },
  //     ],
  //   },
  // };

  return (
    <>
      <div
        className={`${styles.container} align-items-center`}
      >
        {profile ? (
          <Container>
            <ProviderProfile profile={profile} />
          </Container>
        ) : (
          <Spinner size="sm" animation="border" variant="light" />
        )}
      </div>
    </>
  );
};

export { ProviderProfileDetails };
